import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { PreMaritalTestService } from './service/pre-marital-test.service';
import { CreateTestUsecase } from './service/usecase/create-test.usecase';
import { TherapyManagementServiceModule } from '../therapy-management/therapy-management-service.module';
import { GetAllTestsUsecase } from './service/usecase/get-all-tests.usecase';
import { CreateQuestionUsecase } from './service/usecase/create-question.usecase';
import { GetQuestionByIdUsecase } from './service/usecase/get-question-by-id.usecase';
import { AddAnswerToQuestionUsecase } from './service/usecase/add-answer-to-question.usecase';
import { GetQuestionsOfTestUsecase } from './service/usecase/get-questions-of-test.usecase';
import { GetTestByIdUsecase } from './service/usecase/get-test-by-id.usecase';
import { CountQuestionsOfTestUsecase } from './service/usecase/count-questions-of-test.usecase';
import { SubmitTestUsecase } from './service/usecase/submit-test.usecase';
import { GetUserDoneTestsUsecase } from './service/usecase/get-user-done-tests.usecase';
import { CountUserDoneTestsUsecase } from './service/usecase/count-user-done-tests.usecase';
import { GetTestResultByIdUsecase } from './service/usecase/get-test-result-by-id.usecase';

const useCases = [
  CreateTestUsecase,
  GetAllTestsUsecase,
  CreateQuestionUsecase,
  GetQuestionByIdUsecase,
  AddAnswerToQuestionUsecase,
  GetTestByIdUsecase,
  GetQuestionsOfTestUsecase,
  CountQuestionsOfTestUsecase,
  SubmitTestUsecase,
  GetUserDoneTestsUsecase,
  CountUserDoneTestsUsecase,
  GetTestResultByIdUsecase,
];

@Module({
  imports: [PersistenceModule, TherapyManagementServiceModule],
  providers: [
    {
      provide: 'IPremaritalTestService',
      useClass: PreMaritalTestService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'IPremaritalTestService'],
})
export class PreMaritalTestServiceModule {}
