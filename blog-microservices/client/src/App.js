import PostCreate from "./components/PostCreate";
import PostList from "./components/PostList";

function App() {
    return (
        <div className="container">
            <PostCreate />
            <hr />
            <PostList />
        </div>
    );
}

export default App;
