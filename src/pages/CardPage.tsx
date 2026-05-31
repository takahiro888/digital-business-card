import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { CardUser } from "@/domain/user";
import { getSocialLinks } from "@/domain/user";
import { getUserWithSkills } from "@/utils/supabaseFunctions";
import {
  Box,
  Stack,
  Spinner,
  Text,
  Container,
  Heading,
  HStack,
  Tag,
  Link,
} from "@chakra-ui/react";
import { FaGithubSquare } from "react-icons/fa";
import { SiQiita, SiX } from "react-icons/si";

const iconByLabel = {
  GitHub: FaGithubSquare,
  Qiita: SiQiita,
  X: SiX,
};

export const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<CardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        return;
      }

      const result = await getUserWithSkills(id);

      if (!result) {
        return;
      }
      setUser(result);
      setIsLoading(false);
    };

    void fetchUser();
  }, [id]);

  const socialLinks = useMemo(() => (user ? getSocialLinks(user) : []), [user]);

  if (isLoading) {
    return (
      <Box minH="100dvh">
        <Stack align="center" gap="3">
          <Spinner />
          <Text fontSize="sm">Loading...</Text>
        </Stack>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box minH="100dvh">
        <Stack align="center" gap="3">
          <Text fontSize="sm">User not found</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box minH="100dvh" bg="gray.200" py={{ base: 8, md: 12 }}>
      <Container maxW={{ base: "375px", md: "560px" }} py={{ base: 4, md: 8 }}>
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          p={{ base: 5, md: 8 }}
          borderWidth="1px"
          borderColor="blackAlpha.200"
        >
          <Stack gap={{ base: 5, md: 6 }}>
            <Stack gap="1">
              <Heading size={{ base: "lg", md: "xl" }}>{user?.name}</Heading>
              <Text fontSize="xs" color="gray.500">
                ID:{user?.id}
              </Text>
            </Stack>

            <Stack gap="2">
              <Heading as="h2" size="sm">
                自己紹介
              </Heading>
              <Box
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.8"
                css={{
                  "& h1": {
                    fontSize: "1.25rem",
                    marginBottom: "0.5rem",
                  },
                  "& p": { marginBottom: "0.5rem" },
                }}
                dangerouslySetInnerHTML={{ __html: user.description }}
              />
            </Stack>

            <Stack gap="2">
              <Heading as="h2" size="sm">
                好きな技術
              </Heading>
              <HStack>
                {user.skills.map((skill) => (
                  <Tag.Root key={skill.id}>
                    <Tag.Label>{skill.name}</Tag.Label>
                  </Tag.Root>
                ))}
              </HStack>
            </Stack>
          </Stack>

          {socialLinks.length > 0 && (
            <Stack gap="2" mt="4">
              <Heading as="h2" size="sm">
                SNS
              </Heading>
              <HStack gap="4">
                {socialLinks.map((item) => {
                  const Icon = iconByLabel[item.label];
                  return (
                    <Link
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      fontSize="2xl"
                      color="gray.700"
                      _hover={{ color: "black" }}
                    >
                      <Icon />
                    </Link>
                  );
                })}
              </HStack>
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
};
