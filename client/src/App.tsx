import './App.css';
import QuillrEditor from './QuillrEditor';

function App() {
  return (
    <div className="container">
      <h1 className='display-1 mt-3'>
        <a href="https://quilljs.com" target={"_blank"} rel={'noreferrer'} className='text-decoration-none text-secondary'>Quill</a>
        <a href="https://reactjs.org/" target={"_blank"} rel={'noreferrer'} className='text-decoration-none text-info'>R</a>
      </h1>
      <p className='text-muted'>Built with quill and react.</p>
      <QuillrEditor />
    </div>
  );
}

export default App;
