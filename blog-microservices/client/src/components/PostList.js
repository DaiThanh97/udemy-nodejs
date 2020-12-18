import React, { Component } from 'react'
import axios from 'axios';
import PostItem from './PostItem';

export default class PostList extends Component {

    state = {
        posts: []
    }

    componentDidMount = () => {
        this.getPosts();
    }

    getPosts = async () => {
        const res = await axios.get('http://localhost:4002/posts');
        this.setState({
            posts: res.data
        });
    }

    generatePosts = () => {
        return this.state.posts.map((p, index) => {
            return <div key={index} className="col-4">
                <PostItem detail={p} />
            </div>
        })
    }

    render() {
        return (
            <div>
                <h1>Posts</h1>
                <div className="row">
                    {this.generatePosts()}
                </div>
            </div>
        )
    }
}
