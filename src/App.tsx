import "./App.css";

import EditorComponent from "./Editor";

function App() {
  return (
    <div className="flex h-[70vh] items-center justify-center mt-30">
      <div className="w-full h-full">
        <EditorComponent />
      </div>
    </div>
  );
}

export default App;
