import {
  Box,
  Stack,
  Container,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  createUser,
  getAllSkills,
  linkUserSkills,
} from "@/utils/supabaseFunctions";
import { useEffect, useState } from "react";
import type { SkillRow } from "@/domain/user";
import { useNavigate } from "react-router-dom";
type RegisterCardForm = {
  favoriteWord: string;
  name: string;
  description: string;
  favoriteSkill: string;
  githubId: string;
  qiitaId: string;
  xId: string;
};

export const RegisterCardPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    register,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCardForm>();

  useEffect(() => {
    const loadSkills = async () => {
      const list = await getAllSkills();
      setSkills(list);
    };
    loadSkills();
  }, []);
  const descriptionValue = watch("description");
  const descriptionLength = descriptionValue?.length ?? 0;
  const onSubmit = async (values: RegisterCardForm) => {
    setPageError(null);
    try {
      // 1.ユーザーテーブルに登録
      const user = await createUser({
        id: values.favoriteWord,
        name: values.name,
        description: values.description,
        githubId: values.githubId,
        qiitaId: values.qiitaId,
        xId: values.xId,
      });

      // 2.選んだ技術をuser_skillに保存
      await linkUserSkills(user.id, Number(values.favoriteSkill));

      reset();

      // 3.登録完了後にトップページへ遷移
      navigate("/");
    } catch (error) {
      if (error instanceof Error && error.name === "ID_DUPLICATE") {
        setError("favoriteWord", {
          type: "manual",
          message:
            "このIDは既に使用されています。別の英単語を入力してください。",
        });
        return;
      }
      setPageError(
        "登録中にエラーが発生しました。時間をおいて再度お試しください。",
      );
    }
  };

  return (
    <Box minH="100dvh" bg="gray.200" py={{ base: 8, md: 12 }}>
      <Container maxW={{ base: "375px", md: "560px" }} py={{ base: 4, md: 8 }}>
        <Heading textAlign="center" mb="6">
          新規名刺登録
        </Heading>
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          p={{ base: 5, md: 8 }}
          borderWidth="1px"
          borderColor="blackAlpha.200"
        >
          <Stack
            as="form"
            gap={{ base: 5, md: 6 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box>
              <Text fontWeight="bold" mb="1">
                好きな英単語 *（IDになります）
              </Text>
              <Input
                placeholder="好きな英単語を入力してください"
                {...register("favoriteWord", {
                  required: "好きな英単語は必須です",
                  minLength: {
                    value: 2,
                    message: "2文字以上で入力してください",
                  },
                })}
              />
              {errors.favoriteWord && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.favoriteWord.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontWeight="bold" mb="1">
                お名前 *
              </Text>
              <Input
                placeholder="山田太郎"
                {...register("name", {
                  required: "お名前は必須です",
                  maxLength: {
                    value: 30,
                    message: "30文字以内で入力してください",
                  },
                })}
              />
              {errors.name && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.name.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontWeight="bold" mb="1">
                自己紹介 *
              </Text>
              <Textarea
                placeholder="自己紹介を入力"
                {...register("description", {
                  required: "自己紹介は必須です",
                  minLength: {
                    value: 10,
                    message: "10文字以上で入力してください",
                  },
                })}
              />
              <Text mt="1" fontSize="xs" color="gray.500">
                {descriptionLength}文字
              </Text>
              {errors.description && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.description.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontWeight="bold" mb="1">
                好きな技術 *
              </Text>
              <Box
                as="select"
                h="40px"
                w="100%"
                px="3"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
                {...register("favoriteSkill", {
                  required: "好きな技術は必須です",
                })}
              >
                <option value="">Select option</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </Box>
              {errors.favoriteSkill && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.favoriteSkill.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontWeight="bold" mb="1">
                GitHub ID
              </Text>
              <Input placeholder="@は不要" {...register("githubId")} />
            </Box>

            <Box>
              <Text fontWeight="bold" mb="1">
                Qiita ID
              </Text>
              <Input placeholder="@は不要" {...register("qiitaId")} />
            </Box>

            <Box>
              <Text fontWeight="bold" mb="1">
                X ID
              </Text>
              <Input placeholder="@は不要" {...register("xId")} />
            </Box>

            <Text fontSize="sm" color="gray.600">
              * は必須項目です
            </Text>

            {pageError && (
              <Text fontSize="sm" color="red.500">
                {pageError}
              </Text>
            )}
            <Button
              type="submit"
              colorPalette="blue"
              loading={isSubmitting}
              w="100%"
            >
              登録
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
