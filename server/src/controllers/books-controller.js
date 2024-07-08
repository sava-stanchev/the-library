import express from "express";
import booksData from "../data/books.js";
import transformBody from "../middlewares/transform-body.js";
import { authMiddleware, roleMiddleware } from "../auth/auth-middleware.js";
import { userRole } from "../common/user-role.js";
import reviewCreateValidator from "../validators/review-create-validation.js";
import loggedUserGuard from "../middlewares/logged-user-guard.js";
import validateBody from "../middlewares/validate-body.js";
import roleAuth from "../middlewares/role-auth.js";
import reviewsData from "../data/reviews.js";

const booksController = express.Router();

booksController

  /** Retrieve all books */
  .get("/", async (req, res) => {
    const { sort } = req.query;
    try {
      if (sort) {
        const theBooksSortedByYear = await booksData.sortBooksByYear(sort);
        return res.json(theBooksSortedByYear);
      }

      const theBooks = await booksData.getAllBooks();
      res.json(theBooks);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  /** Retrieve one book */
  .get("/:id", async (req, res) => {
    const bookId = +req.params.id;
    try {
      const book = await booksData.getBookById(bookId);
      res.json(book[0]);
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  })

  /** Read book reviews */
  .get("/:id/reviews", authMiddleware, loggedUserGuard, async (req, res) => {
    try {
      const { id } = req.params;
      const theReviews = await reviewsData.getReviewsForBook(+id);
      if (!theReviews) {
        return res.json({
          msg: "Book has no reviews yet!",
        });
      }

      return res.send(theReviews);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  /** Create book review */
  .post(
    "/:id/create-review",
    transformBody(reviewCreateValidator),
    validateBody("review", reviewCreateValidator),
    authMiddleware,
    loggedUserGuard,
    async (req, res) => {
      const bookId = +req.params.id;
      const userId = +req.user.id;
      const book = await booksData.getBookById(+bookId);
      try {
        if (!book[0]) {
          return res.status(404).json({
            msg: `Book was not found!`,
          });
        }

        const check = (await reviewsData.userReviewByBookId(userId, bookId))[0];
        if (check) {
          return res.status(200).json({
            message: "Review already exists!",
          });
        }
        const review = await reviewsData.createReview(
          bookId,
          req.body.content,
          userId
        );

        return res.status(200).json(review);
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    }
  )

  /** Rate book */
  .patch("/:id/rating", async (req, res) => {
    try {
      const bookId = req.params.id;
      const reqBody = req.body;
      const rating = reqBody[0];
      const book = await booksData.getBookById(bookId);

      if (!book) {
        return res.status(404).json({
          massage: "Book not found!",
        });
      }

      await booksData.updateBookRating(bookId, rating);
      const newBookData = await booksData.getBookById(bookId);
      return res.status(200).send(newBookData[0]);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  })

  /** Delete any book (as admin) */
  .delete(
    "/:id",
    authMiddleware,
    loggedUserGuard,
    roleAuth(userRole.Admin),
    async (req, res) => {
      try {
        await booksData.deleteBook(+req.params.id);
        res.json({
          message: `Book deleted`,
        });
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    }
  );

export default booksController;
