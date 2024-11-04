public abstract class NoPackage {

  private static final NoPackage.Folder Folder = new Folder();

  private NoPackage() {}

  public static NoPackage.Folder Folder() {
    return Folder;
  }

  public final static class Folder extends NoPackage {
    private Folder() {
    }
    @Override
    public String toString() {
      return "Folder{"
        + "}";
    }
    @Override
    public boolean equals(Object o) {
      if (o == this) {
        return true;
      }
      if (o instanceof NoPackage.Folder) {
        NoPackage.Folder that = (NoPackage.Folder) o;
        return true
          ;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return java.util.Objects.hash(2109868174
      );
    }
  }

  public final <T> Matching_Folder<T> matching() {
    return new Matching_Folder<T>();
  }
  public final class Matching_Folder<T> {
    private Matching_Folder() {}
    public FinalMatching Folder(java.util.function.Function<Folder, T> matcher) {
      return new FinalMatching<T>();
    }
  }
  public final class FinalMatching<T> {
    private FinalMatching() {}
    public T get() {
      throw new RuntimeException();
    }
  }

}
