import AuthGate from '../components/auth-layout/auth-gate';
console.log('RootIndex rendered'); // <- thêm dòng này

const RootIndex = () => {
  return <AuthGate />;
};

export default RootIndex;
