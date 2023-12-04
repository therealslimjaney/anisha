/**
 * MyScores component displays user game records and allows deletion of records.
 * @param {string} googleId - Google ID of the user.
 * @returns {JSX.Element} - Rendered user game records with pagination and delete functionality.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyScores.css';

const MyScores = ({ googleId }) => {
    // State variables for user game records and pagination
    const [userGameRecords, setUserGameRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch user game records on component mount or when Google ID or current page changes
    useEffect(() => {
        fetchUserGameRecords();
    }, [googleId, currentPage]);

    // Function to fetch user game records from the API
    const fetchUserGameRecords = async () => {
        const response = await axios.get(
            `https://endtoend-405500.uw.r.appspot.com/findByGoogleId?googleId=${googleId}&page=${currentPage - 1}&size=${pageSize}`
        );
        setTotalPages(response.data.totalPages);
        const { content } = response.data;

        setUserGameRecords(content);
    };

    // Handle page change for pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle deletion of game records
    const handleDeleteGameRecord = async (id) => {
        try {
            await axios.delete(`https://endtoend-405500.uw.r.appspot.com/deleteGameRecord?id=${id}`);
            fetchUserGameRecords();
        } catch (error) {
            console.error('Error deleting game record:', error);
        }
    };

    // Render user game records, delete buttons, and pagination controls
    return (
        <div>
            <br />
            <h4>Your Game Records</h4>
            <div className="my-scores-container">
                <table className="my-scores">
                    <thead>
                        <tr>
                            <th>Google ID</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userGameRecords.map((record) => (
                            <tr key={record.id} className="my-scores-row">
                                <td>{record.googleId}</td>
                                <td>{record.score}</td>
                                <td>{record.date}</td>
                                <td>
                                    <button type="button" onClick={() => handleDeleteGameRecord(record.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="button-container-scores">
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default MyScores;

