export interface Movie {
    id: number;
    title: string;
    desc: string;
    posterUrl: string;
}

export interface MovieDetailResponse {
    id: number;
    title: string;
    desc: string;
    posterUrl: string;
    releaseDate: string | null;
    runtime: number | null;
    lang: string;
}

export interface User {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

export interface UserListItem {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Review {
    id: number;
    movieId: number;
    username: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface AlertDismissibleProps {
    active: boolean;
    msg?: string;
    onClose?: () => void;
}

export interface MovieRatingSummary {
	avgRating: number;
	ratingCnt: number;
	currUserRating: number | null;
}

export interface RatingMutationRes {
	score: number;
	avgRating: number;
	ratingCnt: number;
}

export interface StarRatingProps {
	movieId: number;
	avgRating: number;
	ratingCnt: number;
	currUserRating: number | null;
	onRatingUpdated: (result: RatingMutationRes) => void;
}
