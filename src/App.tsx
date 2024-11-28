import { useEffect, useState } from "react";
import Layout from "@/layout/Layout";
import { FileComparison } from "@/components/fileComparison/FileComparison";
import fileText1 from "@/assets/file1.txt";
import fileText2 from "@/assets/file2.txt";

function App() {
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch(fileText1);
      const text1 = await response.text();
      setFile1(text1);

      const response2 = await fetch(fileText2);
      const text2 = await response2.text();
      setFile2(text2);
    })();
  }, []);

  return (
    <Layout>
      <FileComparison file1={file1} file2={file2} />
    </Layout>
  );
}

export default App;
