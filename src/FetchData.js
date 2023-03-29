import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

function FetchData() {
    const [users, setUsers] = useState([])
    const [selectedUserName, setSelectedUserName] = useState(null);

    useEffect(() => {
        fetch('https://gorest.co.in/public/v2/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(err => console.log(err))
    }, [])

    const [additionalData, setAdditionalData] = useState([]);
    const [loading, setLoading] = useState();
    const handleUserClick = (userId, userName) => {
        setSelectedUserName(userName);
        setSelectedPost(null);
        setAdditionalData([]);
        setPostComments([]);
        setLoading(true);
        if (userName) {
            window.scrollTo(0, 0);
        }
        fetch(`https://gorest.co.in/public/v2/users/${userId}/posts`)
            .then(response => response.json())
            .then(data => {
                setAdditionalData(data.slice(0, 5))
                setLoading(false);
            })
            .catch(err => console.log(err))
    };

    const [selectedPost, setSelectedPost] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const handlePostClick = (userId, postId) => {
        setSelectedPost(postId);
        setLoading(true);
        fetch(`https://gorest.co.in/public/v2/posts/${userId}/comments`)
            .then(response => response.json())
            .then(data => {
                setPostComments(data);
                setLoading(false);
            })
            .catch(err => console.log(err))
    };

    return (
        <div className="container-fluid row mx-2 my-3">
            <ul className="list-group col">
                {users.map(user => (
                    <li key={user.id} onClick={() => handleUserClick(user.id, user.name)} className="list-group-item list-group-item-action">
                        <p><b>{user.name}</b></p>
                        <p>Email: {user.email}</p>
                        <p>Gender: {user.gender}</p>
                        <p>Status: {user.status}</p>
                    </li>
                ))}
            </ul>
            {!loading ? (
                <div className="col">
                    {selectedUserName ? (
                        additionalData.length !== 0 ? (
                            additionalData.map(post => (
                                <div key={post.id} className="card mt-2 px-3 py-3">
                                    <h2>{post.title}</h2>
                                    <p className="card-body">{post.body}</p>
                                    <div>
                                        <button onClick={() => handlePostClick(post.id)} type="button" className="btn btn-dark">Comments</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="alert alert-warning mt-2">No posts by <i>{selectedUserName}</i></p>
                        )
                    ) : (
                        <p className="alert alert-info">Select a user to show posts...</p>
                    )}
                    {postComments.length !== 0 ? (
                        postComments.map(comment => (
                            <div key={comment.id} className="card mt-2">
                                <p className="card-header">Comment by:<b> {comment.name}</b></p>
                                <p className="card-body mb-0">{comment.body}</p>
                            </div>
                        ))
                    ) : selectedPost === undefined ? (
                        <p className="alert alert-secondary mt-2">No Comments...</p>
                    ) : (null)}
                </div>
            ) : (
                <div className="col">
                    <LinearProgress />
                </div>
            )}
        </div>
    )
}

export default FetchData;