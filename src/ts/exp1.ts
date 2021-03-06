// 可辨识联合

/**
 * 1. 可辨识联合|标签联合
 *  可以将枚举成员、字面量类型、联合类型、类型保护、类型别名这几种类型进行合并，创建一个可辨识联合的高级类型
 *  可辨识联合具备两个要求
 *    1. 具有普通的单例类型属性（这个要作为辨识的特征，也是重要因素）。
 *    2. 一个类型别名，包含了那些类型的联合（即把几个类型封装为联合类型，并起一个别名）。
 *
 *  所谓单例类型，你可以理解为符合 单例模式 的数据类型，比如枚举成员类型，字面量类型。
 */
interface Square {
  kind: 'square'; // 这个就是具有辨识性的属性
  size: number;
}
interface Rectangle {
  kind: 'rectangle'; // 这个就是具有辨识性的属性
  height: number;
  width: number;
}
interface Circle {
  kind: 'circle'; // 这个就是具有辨识性的属性
  radius: number;
}

// type Shape = Square | Rectangle | Circle; // 这里使用三个接口组成一个联合类型，并赋给一个别名Shape，组成了一个可辨识联合。
// function getArea(s: Shape) {
//   switch (s.kind) {
//     case 'square':
//       return s.size * s.size;
//     case 'rectangle':
//       return s.height * s.width;
//     case 'circle':
//       return Math.PI * s.radius ** 2;
//   }
// }

// Shape 新增一个类型
interface Triangle {
  kind: 'triangle';
  bottom: number;
  height: number;
}

type Shape = Square | Rectangle | Circle | Triangle; // 这里使用三个接口组成一个联合类型，并赋给一个别名Shape，组成了一个可辨识联合。
// 上面例子中，的 Shape 联合有四种接口，但函数的 switch 里只包含三个 case，这个时候编译器并没有提示任何错误，因为当传入函数的是类型是 Triangle 时，没有任何一个 case 符合，则不会有 return 语句执行，那么函数是默认返回 undefined。所以可以利用这个特点，结合 strictNullChecks 编译选项，可以开启 strictNullChecks，然后让函数的返回值类型为 number，那么当返回 undefined 的时候，就会报错
// function getArea(s: Shape): number {
//   switch (s.kind) {
//     case 'square':
//       return s.size * s.size;
//     case 'rectangle':
//       return s.height * s.width;
//     case 'circle':
//       return Math.PI * s.radius ** 2;
//     case 'triangle':
//       return s.bottom * s.height;
//   }
// }

// 当函数返回一个错误或者不可能有返回值的时候，返回值类型为 never。所以可以给 switch 添加一个 default 流程，当前面的 case 都不符合的时候，会执行 default 后的逻辑：
function assertNever(value: never): never {
  throw new Error('Unexpected object: ' + value);
}
function getArea(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size;
    case 'rectangle':
      return s.height * s.width;
    case 'circle':
      return Math.PI * s.radius ** 2;
    case 'triangle':
      return s.bottom * s.height;
    default:
      return assertNever(s); // error 类型“Triangle”的参数不能赋给类型“never”的参数
  }
}

/**
 * 2. 索引类型
 */

/**
 * 2.1 索引类型查询操作符
 *  keyof 操作符，连接一个类型，会返回一个由这个类型的所有属性名组成的联合类型
 */

interface indexInfo {
  name: string;
  age: number;
}

// keyof indexInfo 等价于 'name'|'age'
let ii1: keyof indexInfo;
ii1 = 'name';
ii1 = 'age';
// ii1 = 'gender'; // error 因为不能将 'gender' 赋值给 'name'|'age'

// 通过和泛型结合使用，TS 就可以检查使用了动态属性名的代码
function getObjValue<T, K extends keyof T>(obj: T, names: K[]): T[K][] {
  // 这里使用泛型，并且约束泛型变量K的类型是"keyof T"，也就是类型T的所有字段名组成的联合类型
  return names.map(n => obj[n]); // 指定getValue的返回值类型为T[K][]，即类型为T的值的属性值组成的数组
}
const objInfo = {
  name: 'wy',
  age: 18,
  hobby: 'basketball'
};
let values: string[] = getObjValue(objInfo, ['name']);
values = getObjValue(objInfo, ['hobby']);
// values = getObjValue(objInfo, ['age']); // error 不能将类型“number[]”分配给类型“string[]”

/**
 * 2.2 索引访问操作符
 *  索引访问操作符就是[]，其实和我们访问对象的某个属性值是一样的语法，但是在 TS 中它可以用来访问某个属性的类型
 */
interface objInfo2 {
  name: string;
  age: number;
}
type NameType = objInfo2['name'];
let name2: NameType = 'nordon';
// let name3: NameType = 123; // error 不能将类型“123”分配给类型“string”
