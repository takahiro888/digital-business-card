import {
  Button,
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const TopPage = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim() === "") {
      setError("IDを入力してください");
      return;
    }
    navigate(`/cards/${id.trim()}`);
  };

  return (
    <Box minH="100dvh" bg="gray.100" display="flex" alignItems="center">
      <Container maxW="400px">
        <Stack gap="6" align="center">
          <Heading size="lg">デジタル名刺アプリ</Heading>

          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p="6"
            w="100%"
            borderWidth="1px"
            borderColor="blackAlpha.200"
          >
            <Stack as="form" gap="4" onSubmit={handleSubmit}>
              <Box>
                <Text>ID</Text>
                <Input
                  placeholder="IDを入力してください"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                    setError(null);
                  }}
                />
                {error && (
                  <Text mt="1" fontSize="sm" color="red.500">
                    {error}
                  </Text>
                )}
              </Box>

              <Button type="submit" colorPalette="teal" w="100%">
                名刺を見る
              </Button>
            </Stack>
          </Box>

          <Link to="/cards/register">
            <Text fontSize="sm">
              新規登録は
              <Text as="span" color="blue.500">
                こちら
              </Text>
            </Text>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};
