import React, { Component } from 'react'
import axios from 'axios';

export default class CommentList extends Component {

    generateComments = (comments) => {
        return comments?.map((c, index) => {
            return <li key={index}>{c.content}</li>
        })
    }

    render() {
        const { comments } = this.props;
        return (
            <div>
                <h5>{comments.length} comments</h5>
                <ul>
                    {this.generateComments(comments)}
                </ul>
            </div >
        )
    }
}
