import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';
import { PrismaService } from '../prisma.service';
import { Question } from '../../../../core/domain/entity/question.entity';
import { PrismaQuestionMapper } from '../mapper/prisma-question-mapper';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(private prisma: PrismaService) {}

  async save(question: Question): Promise<Question> {
    const savedQuestion = await this.prisma.question.upsert({
      where: { question_id: question.id },
      update: {
        question: question.questionText,
        question_no: question.questionNo,
        type: question.type,
        premarital_test_id: question.testId,
        answer: {
          deleteMany: {},
          create:
            question.answerOptions?.map((option) => ({
              answer: option.answer,
              score: option.score,
            })) || [],
        },
      },
      create: {
        question: question.questionText,
        question_no: question.questionNo,
        type: question.type,
        premarital_test_id: question.testId,
        answer: {
          create:
            question.answerOptions?.map((option) => ({
              answer: option.answer,
              score: option.score,
            })) || [],
        },
      },
      include: { answer: true, premaritalTest: true },
    });

    return PrismaQuestionMapper.toDomain(savedQuestion);
  }

  async findQuestionById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { question_id: questionId },
      include: { answer: true, premaritalTest: true },
    });
    return question ? PrismaQuestionMapper.toDomain(question) : null;
  }

  async findQuestionsByTestId(
    testId: string,
    skip: number,
    take: number,
  ): Promise<Question[]> {
    return await this.prisma.question
      .findMany({
        where: { premarital_test_id: testId },
        include: { answer: true, premaritalTest: true },
        skip,
        take,
      })
      .then((questions) =>
        questions.map((question) => PrismaQuestionMapper.toDomain(question)),
      );
  }

  countQuestionsByTestId(testId: string): Promise<number> {
    return this.prisma.question.count({
      where: { premarital_test_id: testId },
    });
  }

  async findAnswerById(answerId: string): Promise<AnswerOption | null> {
    return this.prisma.answer
      .findUnique({
        where: { answer_id: answerId },
      })
      .then((result) =>
        result ? PrismaQuestionMapper.toAnswerOptionDomain(result) : null,
      );
  }

  async saveAnswerOption(answer: AnswerOption): Promise<AnswerOption> {
    return this.prisma.answer
      .upsert({
        where: { answer_id: answer.id },
        update: {
          answer: answer.answer,
          score: answer.score,
        },
        create: {
          question: {
            connect: { question_id: answer.questionId },
          },
          answer: answer.answer,
          score: answer.score,
        },
      })
      .then((result) => PrismaQuestionMapper.toAnswerOptionDomain(result));
  }
}
