import React, { Component } from 'react'
import axios from 'axios';

export default class CommentCreate extends Component {

    state = {
        content: '',
    };

    onSendComment = async () => {
        const { content } = this.state;
        const { postId } = this.props;
        await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content
        });

        this.setState({
            content: ''
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { content } = this.state;
        return (
            <form onSubmit={() => this.onSendComment()} >
                <div className="form-group">
                    <label htmlFor="content">Comment:</label>
                    <input onChange={this.onChange} value={content} type="text" className="form-control" placeholder="Enter comment" name="content" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}
