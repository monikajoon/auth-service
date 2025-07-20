import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as AWS from 'aws-sdk';

@Injectable()
export class AuthService {
  private readonly dynamoDb: AWS.DynamoDB.DocumentClient;

  constructor(private readonly jwtService: JwtService) {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: 'AKIA437JTQEMRNHWPRXC',
      secretAccessKey: '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',
    });

    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const params = {
      TableName: 'user-table',
      Key: { username },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      const user = result.Item;

      if (user && await bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user from DynamoDB:', error);
      return null;
    }
  }

  async addUser(user: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const params = {
      TableName: 'user-table',
      Item: {
        username: user.username,
        password: hashedPassword,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
      },
    };

    try {
      await this.dynamoDb.put(params).promise();
      return { message: 'User added successfully' };
    } catch (error) {
      console.error('Error adding user to DynamoDB:', error);
      throw new Error('Could not add user');
    }
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

    async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
