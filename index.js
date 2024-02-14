"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const memory_1 = require("langchain/vectorstores/memory");
const openai_1 = require("@langchain/openai");
const text_splitter_1 = require("langchain/text_splitter");
const chains_1 = require("langchain/chains");
const openai_2 = require("@langchain/openai");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
function createRetrievalChain() {
    return __awaiter(this, void 0, void 0, function* () {
        // Change this if you want to use a different document
        const loader = new pdf_1.PDFLoader("habitos-atomicos.pdf");
        const docs = yield loader.load();
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 100,
        });
        const splittedDocs = yield textSplitter.splitDocuments(docs);
        const vectorStore = yield memory_1.MemoryVectorStore.fromDocuments(splittedDocs, new openai_1.OpenAIEmbeddings({ openAIApiKey: "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" }));
        const model = new openai_2.ChatOpenAI({ modelName: "gpt-3.5-turbo" });
        const chain = chains_1.RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
        //Change the query to the question you want to ask
        const response = yield chain.invoke({
            query: "Cuales son las 4 etapas de un habito",
        });
        console.log(response);
    });
}
exports.default = createRetrievalChain;
createRetrievalChain();
