import { Injectable } from '@nestjs/common';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { PrismaService } from '../prisma.service';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { PrismaWithdrawRequestMapper } from '../mapper/prisma-withdraw-request-mapper';
import { TherapistBalance } from '../../../../core/domain/entity/therapist-balance.entity';
import { PrismaTherapistMapper } from '../mapper/prisma-therapist-mapper';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class PrismaWithdrawRequestRepository
  implements WithdrawRequestRepository
{
  constructor(private prisma: PrismaService) {}

  // async save(withdrawRequest: WithdrawRequest): Promise<WithdrawRequest> {
  //   return this.prisma.withdrawRequest
  //     .create({
  //       data: {
  //         amount: withdrawRequest.amount,
  //         currency: withdrawRequest.currency,
  //         status: withdrawRequest.status,
  //         therapist: {
  //           connect: {
  //             user_id: withdrawRequest.therapistId,
  //           },
  //         },
  //         payoutAccount: {
  //           connect: {
  //             id: withdrawRequest.payoutAccountId,
  //           },
  //         },
  //       },
  //     })
  //     .then((result) => PrismaWithdrawRequestMapper.toDomain(result));
  // }

  async save(withdrawRequest: WithdrawRequest): Promise<WithdrawRequest> {
    return this.prisma.withdrawRequest
      .upsert({
        where: {
          request_id: withdrawRequest.id,
        },
        update: {
          amount: withdrawRequest.amount,
          currency: withdrawRequest.currency,
          status: withdrawRequest.status,
          payout_account_id: withdrawRequest.payoutAccountId,
        },
        create: {
          request_id: withdrawRequest.id,
          amount: withdrawRequest.amount,
          currency: withdrawRequest.currency,
          status: withdrawRequest.status,
          therapist_id: withdrawRequest.therapistId,
          payout_account_id: withdrawRequest.payoutAccountId,
        },
      })
      .then((result) => PrismaWithdrawRequestMapper.toDomain(result));
  }

  async updateTherapistBalance(
    therapistId: string,
    balance: number,
  ): Promise<TherapistBalance> {
    return this.prisma.therapistBalance
      .update({
        where: {
          therapist_id: therapistId,
        },
        data: {
          balance,
        },
      })
      .then((result) => PrismaTherapistMapper.toTherapistBalanceDomain(result));
  }

  async getWithdrawRequestsByTherapistId(
    therapistId: string,
    page: number,
    limit: number,
    status: string | undefined,
    payoutAccountId: string | undefined,
  ): Promise<WithdrawRequest[]> {
    return this.prisma.withdrawRequest
      .findMany({
        where: {
          therapist_id: therapistId,
          status: status as RequestStatus | undefined,
          payout_account_id: payoutAccountId ? payoutAccountId : undefined,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          created_at: 'desc',
        },
      })
      .then((results) =>
        results.map((result) => PrismaWithdrawRequestMapper.toDomain(result)),
      );
  }

  async getWithdrawRequestById(
    withdrawRequestId: string,
  ): Promise<WithdrawRequest | null> {
    return this.prisma.withdrawRequest
      .findUnique({
        where: {
          request_id: withdrawRequestId,
        },
      })
      .then((result) =>
        result ? PrismaWithdrawRequestMapper.toDomain(result) : null,
      );
  }

  async countWithdrawRequestsByTherapistId(
    therapistId: string,
    status: string | undefined,
    payoutAccountId: string | undefined,
  ): Promise<number> {
    return this.prisma.withdrawRequest.count({
      where: {
        therapist_id: therapistId,
        status: status as RequestStatus | undefined,
        payout_account_id: payoutAccountId ? payoutAccountId : undefined,
      },
    });
  }

  async getAllWithdrawRequests(
    page: number,
    limit: number,
    status: string | undefined,
  ): Promise<WithdrawRequest[]> {
    return this.prisma.withdrawRequest
      .findMany({
        where: {
          status: status as RequestStatus,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          created_at: 'desc',
        },
      })
      .then((results) =>
        results.map((result) => PrismaWithdrawRequestMapper.toDomain(result)),
      );
  }

  async countAllWithdrawRequests(status: string | undefined): Promise<number> {
    return this.prisma.withdrawRequest.count({
      where: {
        status: status as RequestStatus | undefined,
      },
    });
  }

  async getLastWithdrawRequest(
    therapistId: string,
  ): Promise<WithdrawRequest | null> {
    return this.prisma.withdrawRequest
      .findMany({
        where: {
          therapist_id: therapistId,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 1,
      })
      .then((results) =>
        results.length > 0
          ? PrismaWithdrawRequestMapper.toDomain(results[0])
          : null,
      );
  }
}
