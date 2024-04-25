import React, { useState } from "react";
import {
  HStack,
  VStack,
  Text,
  IconButton,
  StackDivider,
  Spacer,
  Input,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function Todo(props) {
    const { todo, setTodos } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editedTodo, setEditedTodo] = useState(todo.todo);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const saveEdit = async (todoId) => {
      try {
        setTodos((currentTodos) => {
          return currentTodos.map((currentTodo) => {
            if (currentTodo._id === todoId) {
              return { ...currentTodo, todo: editedTodo };
            }
            return currentTodo;
          });
        });

        setIsEditing(false); 

        const res = await fetch(`/api/todos/${todoId}`, {
          method: "PUT",
          body: JSON.stringify({ todo: editedTodo }),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const json = await res.json();
        if (!json.acknowledged) {
          throw new Error("Failed to update todo.");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    };

    const handleInputChange = (event) => {
      setEditedTodo(event.target.value);
    };
  
    const deleteTodo = async (todoId) => {
      try {
        setTodos((currentTodos) => {
          return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
        });
  
        const res = await fetch(`/api/todos/${todoId}`, {
          method: "DELETE",
        });
  
        const json = await res.json();
        if (!json.acknowledged) {
          throw new Error("Failed to delete todo.");
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    };

    return (
      <VStack
        divider={<StackDivider />}
        borderColor="pink.500"
        borderWidth="2px"
        p="4"
        borderRadius="lg"
        width="100%"
        height="60px"
        marginTop="20px"
        maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
        alignItems="stretch"
      >
        <HStack>
          {isEditing ? (
            <Input
              value={editedTodo}
              onChange={handleInputChange}
              autoFocus
            />
          ) : (
            <Text>{todo.todo}</Text>
          )}
          <Spacer />
          {isEditing ? (
            <IconButton
              icon={<MdEdit />}
              isRound="true"
              colorScheme="teal"
              onClick={() => saveEdit(todo._id)}
            />
          ) : (
            <IconButton
              icon={<MdEdit />}
              isRound="true"
              colorScheme="teal"
              onClick={handleEdit}
            />
          )}
          <IconButton
            icon={<FaTrash />}
            isRound="true"
            colorScheme="red"
            onClick={() => deleteTodo(todo._id)} 
          />
        </HStack>
      </VStack>
    );
}
