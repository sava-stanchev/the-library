import { useEffect, useState, useMemo } from "react";
import { SPRING } from "src/common/constants";
import Loader from "src/components/Loader";
import { Container, Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Search from "src/components/Search";
import { UserListItem } from "src/types";

const Users: React.FC = () => {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");

    const filteredUsers = useMemo(() => users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())), [users, search]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${SPRING}/api/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok)
                    throw new Error(`Failed to fetch users: ${res.status}`);

                const data: UserListItem[] = await res.json();
                setUsers(data);
            } catch (e) {
                console.error("Error fetching users:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId: number) => {
        try {
            const res = await fetch(`${SPRING}/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.status !== 204)
                throw new Error(`Failed to delete user: ${res.status}`);

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (e) {
            console.error("Error deleting user:", e);
        }
    };

    return (
        <Container className="my-5">
            <Search search={search} onSearchChange={setSearch} />
            {loading ? (
                <Loader />
            ) : (
                <div className="border border-secondary rounded-3 overflow-hidden bg-dark-subtle">
                    <Table striped responsive className="mb-0 align-middle text-light">
                        <thead className="table-dark">
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                            <button type="button" className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDelete(user.id)} aria-label="Delete user">
                                                <FaTrashAlt />
                                            </button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default Users;
