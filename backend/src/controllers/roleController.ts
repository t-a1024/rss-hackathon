import { Request, Response } from 'express';
import { AIService } from '../services/aiService.js';
import { TeamRoleAssignmentRequest, APIError } from '../types/index.js';

export class RoleController {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async assignRoles(req: Request, res: Response): Promise<void> {
    try {
      const { members, availableRoles }: TeamRoleAssignmentRequest = req.body;

      if (!members || !Array.isArray(members) || members.length === 0) {
        const error: APIError = {
          error: 'INVALID_INPUT',
          message: 'Members array is required and must not be empty'
        };
        res.status(400).json(error);
        return;
      }

      if (!availableRoles || !Array.isArray(availableRoles) || availableRoles.length === 0) {
        const error: APIError = {
          error: 'INVALID_INPUT', 
          message: 'Available roles array is required and must not be empty'
        };
        res.status(400).json(error);
        return;
      }

      const validationError = this.validateInput({ members, availableRoles });
      if (validationError) {
        const error: APIError = {
          error: 'VALIDATION_ERROR',
          message: validationError
        };
        res.status(400).json(error);
        return;
      }

      const result = await this.aiService.assignRoles(members, availableRoles);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Role assignment error:', error);
      
      const apiError: APIError = {
        error: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: 500
      };
      
      res.status(500).json(apiError);
    }
  }

  private validateInput({ members, availableRoles }: TeamRoleAssignmentRequest): string | null {
    for (const member of members) {
      if (!member.id || !member.name) {
        return 'Each member must have an id and name';
      }
      if (!member.birthday) {
        return 'Member birthday is required';
      }
      if (!member.age || member.age < 1 || member.age > 100) {
        return 'Member age must be between 1 and 100';
      }
      if (!member.hometown) {
        return 'Member hometown is required';
      }
      if (!member.organization) {
        return 'Member organization is required';
      }
      if (!member.motivation) {
        return 'Member motivation is required';
      }
    }

    for (const role of availableRoles) {
      if (!role.id || !role.title) {
        return 'Each role must have an id and title';
      }
      if (!role.englishTitle) {
        return 'Each role must have an english title';
      }
      if (!role.description) {
        return 'Each role must have a description';
      }
    }

    return null;
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Team Role Assignment API'
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}