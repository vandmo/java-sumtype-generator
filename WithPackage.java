package se.vandmo.javasumtypes;

public abstract class WithPackage {

  private static final WithPackage.Folder Folder = new Folder();

  private WithPackage() {}

  public static WithPackage.Folder Folder() {
    return Folder;
  }

  public final boolean is_Folder() { return this instanceof WithPackage.Folder; }
  public final static class Folder extends WithPackage {
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
      if (o instanceof WithPackage.Folder) {
        return true;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return java.util.Objects.hash(2109868174);
    }
  }

  public final <T> Matching_Folder<T> matching() {
    return new Matching_Folder<T>();
  }
  public final class Matching_Folder<T> {
    private Matching_Folder() {
    }
    public FinalMatching<T> Folder(java.util.function.Function<Folder, T> matcher) {
      return new FinalMatching<T>(java.util.Objects.requireNonNull(matcher));
    }
  }
  public final class FinalMatching<T> {
    private final java.util.function.Function<Folder, T> Folder_matcher;
    private FinalMatching(java.util.function.Function<Folder, T> Folder_matcher) {
      this.Folder_matcher = Folder_matcher;
    }
    public T get() {
      if (WithPackage.this instanceof WithPackage.Folder) {
        return Folder_matcher.apply((WithPackage.Folder)WithPackage.this);
      }
      throw new IllegalStateException("Encountered illegal WithPackage subclass");
    }
  }
  public final Visiting_Folder visiting() {
    return new Visiting_Folder();
  }
  public final class Visiting_Folder {
    private Visiting_Folder() {
    }
    public FinalVisiting Folder(java.util.function.Consumer<Folder> visitor) {
      return new FinalVisiting(java.util.Objects.requireNonNull(visitor));
    }
  }
  public final class FinalVisiting {
    private final java.util.function.Consumer<Folder> Folder_visitor;
    private FinalVisiting(java.util.function.Consumer<Folder> Folder_visitor) {
      this.Folder_visitor = Folder_visitor;
    }
    public void visit() {
      if (WithPackage.this instanceof WithPackage.Folder) {
        Folder_visitor.accept((WithPackage.Folder)WithPackage.this);
        return;
      }
      throw new IllegalStateException("Encountered illegal WithPackage subclass");
    }
  }

}
