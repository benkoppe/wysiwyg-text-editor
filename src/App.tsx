import "./App.css";

import EditorComponent from "./Editor";

function App() {
  return (
    <div className="flex h-[80vh] items-center justify-center mt-15">
      <div className="w-full h-full flex flex-col gap-15">
        <h1 className="text-5xl font-extrabold shadow-lg">
          Ben's <code className="mx-2">WYSIWYG</code> Editor
        </h1>
        <EditorComponent
          placeholder="Press / for commands..."
          maxLength={50000}
        />
      </div>
    </div>
  );
}

export default App;
