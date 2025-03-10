import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { UseCase } from './usecase.interface';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UsecaseHandler {
  constructor(private moduleRef: ModuleRef) {}

  async execute<Command, Response>(
    useCaseClass: new (...args: any[]) => UseCase<Command, Response>,
    command?: Command,
  ): Promise<Response> {
    const useCase = this.moduleRef.get(useCaseClass, { strict: false });
    if (!useCase) {
      throw new ServiceUnavailableException(
        `Use case ${useCaseClass.name} not found`,
      );
    }
    return useCase.execute(command);
  }
}

// import { Injectable } from '@nestjs/common';
// import { UseCase } from './usecase.interface';
//
// @Injectable()
// export class UsecaseHandler {
//   constructor(private useCases: UseCase<any, any>[]) {}
//
//   async execute<Command, Response>(
//     useCaseClass: new (...args: any[]) => UseCase<Command, Response>,
//     command?: Command,
//   ): Promise<Response> {
//     const useCase = this.useCases.find((uc) => uc instanceof useCaseClass);
//     if (!useCase) {
//       throw new Error(`Use case ${useCaseClass.name} not found`);
//     }
//     return (await useCase.execute(command)) as Promise<Response>;
//   }
// }
