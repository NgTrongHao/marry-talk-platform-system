export interface UseCase<Command, Response> {
  execute(command?: Command): Promise<Response>;
}
