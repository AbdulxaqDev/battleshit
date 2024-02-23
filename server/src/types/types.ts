export type tPlayer = {
  type: string;
  data: {
    name: string;
    password?: string;
    index?: string;
    error?: boolean;
    errorText?: string;
  };
  id: number;
};
