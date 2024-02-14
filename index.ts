import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";


export default async function createRetrievalChain() {

    // Change this if you want to use a different document
    const loader = new PDFLoader("habitos-atomicos.pdf");
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const splittedDocs = await textSplitter.splitDocuments(docs);

    const vectorStore = await MemoryVectorStore.fromDocuments(
        splittedDocs,
        new OpenAIEmbeddings({ openAIApiKey: "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" })
    );

    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    //Change the query to the question you want to ask
    const response = await chain.invoke({
        query: "Cuales son las 4 etapas de un habito",
    });

    console.log(response);
}
createRetrievalChain();