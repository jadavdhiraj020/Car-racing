// Oriented chassis footprints, shared by physical reset placement and rendering.
export const CAR_HALF_WIDTH = 1.28;
export const CAR_HALF_LENGTH = 2.3;
export function overlap(a, b, padding = 0) {
  const axes = [a.yaw, b.yaw].flatMap(yaw => [
    {x:Math.cos(yaw),z:-Math.sin(yaw)}, {x:Math.sin(yaw),z:Math.cos(yaw)}
  ]);
  let depth=Infinity, normal;
  for(const axis of axes){
    const radius = p => (CAR_HALF_WIDTH+padding)*Math.abs(Math.cos(p.yaw)*axis.x-Math.sin(p.yaw)*axis.z)+(CAR_HALF_LENGTH+padding)*Math.abs(Math.sin(p.yaw)*axis.x+Math.cos(p.yaw)*axis.z);
    const distance=(b.x-a.x)*axis.x+(b.z-a.z)*axis.z;
    const penetration=radius(a)+radius(b)-Math.abs(distance);
    if(penetration<=0)return null;
    if(penetration<depth){depth=penetration;normal={x:axis.x*(distance<0?-1:1),z:axis.z*(distance<0?-1:1)};}
  }
  return {...normal,depth};
}
