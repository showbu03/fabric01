# Golang

## variables-constants

## 변수선언

```text
package main

import "fmt"

var g int = 10  // global 변수는 사용되지 않아도 컴파일 에러가 없다.

func main() {

  var local int = 12 // 선언된 변수는 꼭 사용하여야 한다.
  fmt.Println(local)

  // 동일 코드 라인에서 변수 선언
  var a int = 1
  var b float64 = 2.0
  var l, m string = "Larry", "Marry"
  fmt.Println(a, b, l, m)

  // 다중 코드 라인에서 변수 선언
  var (
    c int = 3
    d float64 = 4
    j, k string = "Jack", "Konan"
  )
  fmt.Println(c, d, j, k)

  // 타입이 생략되는 경우 - 기본 타입(default type)으로 타입 추측
  var int1 = 1
  fmt.Printf("int1의 타입은 %T\n", int1)
  var float1 = 1.0
  fmt.Printf("float1의 타입은 %T\n", float1)
  var name = "John Smith"
  fmt.Printf("name의 타입은 %T\n", name)
  var (
    e = 5
    f = 6.0
    o, p = true, "John"
  )
  fmt.Println(e, f, o, p)
  fmt.Printf("%T, %T, %T, %T\n", e, f, o, p)
  // var n = nil  // 타입이 지정되지 않은 변수를 nil로 초기화 할 수 없다.

  // 초기화 하지 않은 변수 선언
  var x int     // = 0
  var y float64 // = 0
  var (
    z string    // = ""
    q bool      // = false
  )
  fmt.Printf("%v, %v, %q, %v\n", x, y, z, q)
}
```

타입이 생략되는경우 기본 타입\(default type\)으로 타입 추측을 한다.

```
$ give me super-powers
```

{% hint style="info" %}
 단, 타입이 지정되지 않은 변수를 nil로 초기화 할 수 없다.
{% endhint %}

Once you're strong enough, save the world:

```
// Ain't no code for that yet, sorry
echo 'You got to trust me on this, I saved the world'
```



