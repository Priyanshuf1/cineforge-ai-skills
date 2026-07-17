import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export const RiveButton = () => {
  const { rive, RiveComponent } = useRive({
    src: '/btn.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });
  const hoverInput = useStateMachineInput(rive, 'State Machine 1', 'Hover', false);
  return <div onMouseEnter={() => hoverInput?.fire()}><RiveComponent /></div>;
};
