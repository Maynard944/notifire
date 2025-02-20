import { ISmsProvider } from '../provider/provider.interface';
import { ChannelTypeEnum } from '../template/template.interface';
import { SmsHandler } from './sms.handler';

test('send sms should call the provider method correctly', async () => {
  const provider: ISmsProvider = {
    id: 'sms-provider',
    channelType: ChannelTypeEnum.SMS,
    sendMessage: () =>
      Promise.resolve({ id: '1', date: new Date().toString() }),
  };

  const spy = jest.spyOn(provider, 'sendMessage');
  const smsHandler = new SmsHandler(
    {
      subject: 'test',
      channel: ChannelTypeEnum.SMS,
      template: `Name: {{firstName}}`,
    },
    provider
  );

  await smsHandler.send({
    $email: 'test@email.com',
    $phone: '+1333322214',
    $user_id: '1234',
    firstName: 'test name',
  });

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith({
    content: 'Name: test name',
    to: '+1333322214',
  });
  spy.mockRestore();
});

test('send sms should template method correctly', async () => {
  const provider: ISmsProvider = {
    id: 'sms-provider',
    channelType: ChannelTypeEnum.SMS,
    sendMessage: () =>
      Promise.resolve({ id: '1', date: new Date().toString() }),
  };

  const spyTemplateFunction = jest
    .fn()
    .mockImplementation(() => Promise.resolve('test'));

  const smsHandler = new SmsHandler(
    {
      subject: 'test',
      channel: ChannelTypeEnum.SMS,
      template: spyTemplateFunction,
    },
    provider
  );

  await smsHandler.send({
    $email: 'test@email.com',
    $phone: '+1333322214',
    $user_id: '1234',
    firstName: 'test name',
  });

  expect(spyTemplateFunction).toHaveBeenCalled();
  expect(spyTemplateFunction).toBeCalledWith({
    $email: 'test@email.com',
    $phone: '+1333322214',
    $user_id: '1234',
    firstName: 'test name',
  });
});
