type Participant = {
    name: string;
    birthdate: string;
    age: number;
    hometown: string;
    affiliation: string;
    aspiration: string;  
    roleId?: string;
    roleTitle?: string;
    roleTitleEnglish?: string;
    reason?: string;
    tips?: string;
  };
  type CompletedPayload = {
    roomId: string;
    status: "completed";
    generatedAt: string;
    participants: number;
    results: Participant[];
  };
  type ProcessingPayload = {
    roomId: string;
    status: "processing";
    message?: string;
    estimatedCompletionTime?: string;
  };

export type {Participant,CompletedPayload,ProcessingPayload};