import type { ModuleMetadata, Type } from '@nestjs/common';
import type { VNPayConfig } from 'vnpay';

export type VnpayModuleOptions = Omit<VNPayConfig, 'error'>;

export interface VnpayModuleOptionsFactory {
  createVnpayOptions(): Promise<VnpayModuleOptions> | VnpayModuleOptions;
}

export interface VnpayModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<VnpayModuleOptionsFactory>;
  useClass?: Type<VnpayModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<VnpayModuleOptions> | VnpayModuleOptions;
  inject?: any[];
}
