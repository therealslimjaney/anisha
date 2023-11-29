import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyScores = ({ googleId }) => {
    const [userGameRecords, setUserGameRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Set your desired page size
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUserGameRecords();
    }, [googleId, currentPage]);

    const fetchUserGameRecords = async (page) => {

            const response = await axios.get(
                `https://endtoend-405500.uw.r.appspot.com/findByGoogleId?googleId=${googleId}&p${page - 1}&size=${pageSize}`
            );
            setTotalPages(response.data.totalPages);
            const { content } = response.data;

            setUserGameRecords(content);
    };






    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDeleteGameRecord = async (id) => {
        try {
            await axios.delete(`https://endtoend-405500.uw.r.appspot.com/deleteGameRecord?id=${id}`);
            // After successful deletion, fetch user game records again to update the list
            fetchUserGameRecords();
        } catch (error) {
            console.error('Error deleting game record:', error);
        }
    };

    return (
        <>
            <div>
                <h2>Your Game Records</h2>
                {/* Render your user game records list here */}
                {userGameRecords.map((record) => (
                    <div key={record.id}>
                        <p>Google ID: {record.googleId}</p>
                        <p>Score: {record.score}</p>
                        <p>Date: {record.date}</p>
                        <button type="button" onClick={() => handleDeleteGameRecord(record.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <div>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span> Page {currentPage} </span>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    // You might need to update this condition based on the actual total pages
                    disabled={userGameRecords.length < 10}
                >
                    Next Page
                </button>
            </div>
        </>
    );
};

export default MyScores;

