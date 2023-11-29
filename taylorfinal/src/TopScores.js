import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TopScores = ({ goBackToGame }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Set your desired page size
    const [totalPages, setTotalPages] = useState(1);
    const [topScores, setTopScores] = useState([]);

    const fetchTopScores = async (page) => {
        try {
            const response = await axios.get(`https://endtoend-405500.uw.r.appspot.com/topOverallScores?page=${page - 1}&size=${pageSize}`);
            setTotalPages(response.data.totalPages);
            // Assuming the response structure includes a 'content' property containing the array of GameRecord
            const { content } = response.data;
            setTopScores(content);
        } catch (error) {
            console.error('Error fetching top scores:', error);
        }
    };

    useEffect(() => {
        fetchTopScores(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <div>
                <h2>Top Scores</h2>
                {/* Render your top scores list here */}
                {topScores.map((gameRecord) => (
                    <div key={gameRecord.id}>
                        <span>Google ID: {gameRecord.googleid} - </span>
                        <span>Score: {gameRecord.score} - </span>
                        <span>Date: {gameRecord.date}</span>
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
                <span> Page {currentPage} of {totalPages} </span>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </>
    );
};

export default TopScores;