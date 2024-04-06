export interface todoEvent {
  todo_id: string;
  event_name: string;
  start_time: Date | number | string;
  end_time?: Date | number;
  target_id?: number;
  is_checked: boolean;
  user_id?: number;
  orga_id?: number;
  orga_name?: string;
}

export interface TempTodo {
  event_name: string;
  start_time: Date | number;
  end_time?: Date | number;
  target_id?: number;
  is_checked: boolean;
  user_id?: number;
  orga_id?: number;
  orga_name?: string;
}
