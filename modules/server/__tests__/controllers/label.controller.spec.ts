import LabelController from '@/controllers/label.controller';
import { Label } from '@/entities';
import { IAction } from '@/interfaces';
import { Types } from 'mongoose';

const labelId = new Types.ObjectId();
const userId = new Types.ObjectId();
const labelDoc = { _id: labelId, labels: ['work'], userId } as Label;

describe('LabelController', () => {
  let controller: LabelController;
  let mockCreateLabel: jest.Mocked<IAction<Label>>;
  let mockUpdateLabel: jest.Mocked<IAction<Label>>;
  let mockDeleteLabel: jest.Mocked<IAction<string, boolean>>;

  beforeEach(() => {
    mockCreateLabel = { call: jest.fn() };
    mockUpdateLabel = { call: jest.fn() };
    mockDeleteLabel = { call: jest.fn() };
    controller = new LabelController(mockCreateLabel, mockUpdateLabel, mockDeleteLabel);
  });

  describe('create', () => {
    it('delegates to createLabel action and returns the result', async () => {
      const body = { labels: ['work'], userId } as Label;
      mockCreateLabel.call.mockResolvedValue(labelDoc);
      const result = await controller.create({ body });
      expect(mockCreateLabel.call).toHaveBeenCalledWith(body);
      expect(result).toBe(labelDoc);
    });
  });

  describe('update', () => {
    it('delegates to updateLabel action with id from params and body as payload', async () => {
      const body = { labels: ['personal'] };
      const id = labelId.toString();
      mockUpdateLabel.call.mockResolvedValue(labelDoc);
      const result = await controller.update({ body, params: { id } });
      expect(mockUpdateLabel.call).toHaveBeenCalledWith(id, body);
      expect(result).toBe(labelDoc);
    });
  });

  describe('delete', () => {
    it('delegates to deleteLabel action with id from params', async () => {
      const id = labelId.toString();
      mockDeleteLabel.call.mockResolvedValue(true);
      const result = await controller.delete({ params: { id } });
      expect(mockDeleteLabel.call).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });
});
