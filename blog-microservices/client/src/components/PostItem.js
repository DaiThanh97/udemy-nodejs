import React, { Component } from 'react'
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default class PostItem extends Component {
    render() {
        const { detail } = this.props;
        return (
            <div className="card text-white bg-info">
                <div className="card-body">
                    <h4 className="card-title">{detail.title} #{detail.id}</h4>
                    <CommentList comments={detail.comments} />
                    <CommentCreate postId={detail.id} />
                </div>
            </div>
        )
    }
}
