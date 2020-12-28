import React, { Component } from 'react';
import axios from 'axios';

export default class PostCreate extends Component {

    state = {
        title: '',
    };

    onSendPost = async () => {
        const { title } = this.state;
        await axios.post('http://posts.com/posts/create', {
            title: title
        });

        this.setState({
            title: ''
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { title } = this.state;
        return (
            <div>
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Create Post</h2>
                        <form onSubmit={() => this.onSendPost()} >
                            <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input onChange={this.onChange} value={title} type="text" className="form-control" placeholder="Enter title" id="email" name="title" />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
