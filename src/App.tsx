import "./App.css";

import EditorComponent from "./Editor";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[80vw] h-[80vh] p-8">
        <EditorComponent />
      </div>
    </div>
  );
}

export default App;
