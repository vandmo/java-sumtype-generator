# Java Sum Type Generator

Java, unlike for example [Scala](https://docs.scala-lang.org/scala3/reference/enums/enums.html), has no built in support for [Sum Types](https://en.wikipedia.org/wiki/Sum_type).

This tool generates Java classes that emulates sum types based on a description of those types.

## An Example

Given the following `java-sumtypes.json`:

```json
{
  "java-sumtypes": [
    {
      "name": "Tree",
      "package-name": "se.vandmo.javasumtypes",
      "types": {
        "Empty": {},
        "Leaf": { "value": "int" },
        "Node": { "left": "Tree", "right": "Tree", "value": "int" }
      },
      "imports": "all"
    }
  ]
}
```

Four classes will be generated:

- `Tree`, the sum type representing any one of the possible types
- `Tree.Empty`, a class with only a single value
- `Tree.Leaf`, a class with an integer value
- `Tree.Node`, a class with an integer value and two `Tree` values

Each class will have implementations of `toString`, `equals` and `hashCode` among with fluent APIs for `matching` and `visiting`.

The classes can then be used like this.

```java
IntegrityFlurp i = Tree.Leaf(0);
System.out.println(i);
String s = i.<String>matching()
    .Empty(v -> "empty")
    .Leaf(v -> v.toString())
    .Node(v -> v.toString())
    .get();
System.out.println(s);
i.visiting()
    .Empty(v -> System.out.println(v.toString()))
    .Leaf(v -> System.out.println(v.value))
    .Node(v -> System.out.println(v.toString()))
    .visit();
System.out.println(i.is_Empty());
System.out.println(i.is_Leaf());
System.out.println(i.is_Node());
```

## Usage

Create a `java-symtypes.json` and run:
`docker run --rm -v "${PWD}":/work --user $(id -u):$(id -g) vandmo/java-sumtype-generator`

This should create the files you need in the correct locations under `src/main/java`.

## Limitations

The sum type can only consist of sub classes of itself, although it should be possible to allow for externally definied types.
