public final class IntegrityFlurpTest {

  public static void main(String[] args) {
    IntegrityFlurp i = IntegrityFlurp.CalculatedX("hejhoj", 0);
    System.out.println(i);
    String s = i.<String>matching()
      .Calculated(c -> "c")
      .CalculatedX(c -> "d")
      .Folder(c -> "f")
      .Polder(c -> "p")
      .get();
    System.out.println(s);
    i.visiting()
      .Calculated(x -> System.out.println("c"))
      .CalculatedX(x -> System.out.println("d"))
      .Folder(x -> System.out.println("f"))
      .Polder(x -> System.out.println("p"))
      .visit();
    System.out.println(i.is_CalculatedX());
    System.out.println(i.is_Folder());
  }
}
