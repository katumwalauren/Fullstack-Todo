
import { VStack, IconButton, useColorMode } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { HStack, Button, Input } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";
import Todo from "./Todo";
import "./index.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch("/api/todos");
      const todos = await res.json();

      setTodos(todos);
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setTodos([...todos, newTodo]);
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <VStack p={8}>
      <IconButton
        icon={colorMode === "light" ? <FaSun /> : <FaMoon />}
        isRound="true"
        size="lg"
        alignSelf="flex-end"
        onClick={toggleColorMode}
      />
      <main>
        <Heading
          mb="4"
          fontWeight="extrabold"
          size={colorMode === "light" ? "3xl" : "3xl"}
          bgGradient="linear(to-r, blue.300, orange.400, purple.200)"
          bgClip="text"
        >
          Todo Application
        </Heading>
        <form onSubmit={createNewTodo}>
          <HStack mt="8">
            <Input
              variant="filled"
              placeholder="Enter todos..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button colorScheme="blue" px="8" type="submit">
              Add Todo
            </Button>
          </HStack>
        </form>
        <div>
          {todos.length > 0 &&
            todos.map((todo) => (
              <Todo key={todo._id} todo={todo} setTodos={setTodos} />
            ))}
        </div>
      </main>
    </VStack>
  );
}

