export class CommonService<T extends {id?: number}, X extends T> {

  protected data: T[] = []

  getUsers(): T[] {
    return this.data;
  }

  createUser(entity: X): T {
    const d: T = {
      ...entity,
      id: Math.random(),

    };
    this.data.push(d);
    return entity;
  }

  detailUser(id: number): T {
    return this.data.find(item => item.id === Number(id)) as T;
  }
}