import java.util.Objects;
import java.util.function.Consumer;
import java.util.function.Function;

public abstract class Integrity {

  private static final Integrity.Folder Folder = new Folder();
  private static final Integrity.Ignored Ignored = new Ignored();

  private Integrity() {}

  public static Integrity.Calculated Calculated(String checksum) {
    return new Calculated(checksum);
  }

  public static Integrity.Folder Folder() {
    return Folder;
  }

  public static Integrity.Ignored Ignored() {
    return Ignored;
  }

  public final boolean is_Calculated() { return this instanceof Integrity.Calculated; }
  public final boolean is_Folder() { return this instanceof Integrity.Folder; }
  public final boolean is_Ignored() { return this instanceof Integrity.Ignored; }
  public final static class Calculated extends Integrity {
    public final String checksum;
    private Calculated(String checksum) {
      this.checksum = Objects.requireNonNull(checksum);
    }
    @Override
    public String toString() {
      return "Calculated{"
        + "checksum=" + checksum
        + "}";
    }
    @Override
    public boolean equals(Object o) {
      if (o == this) {
        return true;
      }
      if (o instanceof Integrity.Calculated) {
        Integrity.Calculated that = (Integrity.Calculated) o;
        return
          this.checksum.equals(that.checksum)
          ;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return Objects.hash(854935006, this.checksum);
    }
  }

  public final static class Folder extends Integrity {
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
      if (o instanceof Integrity.Folder) {
        return true;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return Objects.hash(2109868174);
    }
  }

  public final static class Ignored extends Integrity {
    private Ignored() {
    }
    @Override
    public String toString() {
      return "Ignored{"
        + "}";
    }
    @Override
    public boolean equals(Object o) {
      if (o == this) {
        return true;
      }
      if (o instanceof Integrity.Ignored) {
        return true;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return Objects.hash(877898574);
    }
  }

  public final <T> Matching_Calculated<T> matching() {
    return new Matching_Calculated<T>();
  }
  public final class Matching_Calculated<T> {
    private Matching_Calculated() {
    }
    public Matching_Folder<T> Calculated(Function<Calculated, T> matcher) {
      return new Matching_Folder<T>(Objects.requireNonNull(matcher));
    }
  }
  public final class Matching_Folder<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private Matching_Folder(Function<Calculated, T> Calculated_matcher) {
      this.Calculated_matcher = Calculated_matcher;
    }
    public Matching_Ignored<T> Folder(Function<Folder, T> matcher) {
      return new Matching_Ignored<T>(Calculated_matcher, Objects.requireNonNull(matcher));
    }
  }
  public final class Matching_Ignored<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private final Function<Folder, T> Folder_matcher;
    private Matching_Ignored(Function<Calculated, T> Calculated_matcher, Function<Folder, T> Folder_matcher) {
      this.Calculated_matcher = Calculated_matcher;
      this.Folder_matcher = Folder_matcher;
    }
    public FinalMatching<T> Ignored(Function<Ignored, T> matcher) {
      return new FinalMatching<T>(Calculated_matcher, Folder_matcher, Objects.requireNonNull(matcher));
    }
  }
  public final class FinalMatching<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private final Function<Folder, T> Folder_matcher;
    private final Function<Ignored, T> Ignored_matcher;
    private FinalMatching(Function<Calculated, T> Calculated_matcher, Function<Folder, T> Folder_matcher, Function<Ignored, T> Ignored_matcher) {
      this.Calculated_matcher = Calculated_matcher;
      this.Folder_matcher = Folder_matcher;
      this.Ignored_matcher = Ignored_matcher;
    }
    public T get() {
      if (Integrity.this instanceof Integrity.Calculated) {
        return Calculated_matcher.apply((Integrity.Calculated)Integrity.this);
      }
      if (Integrity.this instanceof Integrity.Folder) {
        return Folder_matcher.apply((Integrity.Folder)Integrity.this);
      }
      if (Integrity.this instanceof Integrity.Ignored) {
        return Ignored_matcher.apply((Integrity.Ignored)Integrity.this);
      }
      throw new IllegalStateException("Encountered illegal Integrity subclass");
    }
  }
  public final Visiting_Calculated visiting() {
    return new Visiting_Calculated();
  }
  public final class Visiting_Calculated {
    private Visiting_Calculated() {
    }
    public Visiting_Folder Calculated(Consumer<Calculated> visitor) {
      return new Visiting_Folder(Objects.requireNonNull(visitor));
    }
  }
  public final class Visiting_Folder {
    private final Consumer<Calculated> Calculated_visitor;
    private Visiting_Folder(Consumer<Calculated> Calculated_visitor) {
      this.Calculated_visitor = Calculated_visitor;
    }
    public Visiting_Ignored Folder(Consumer<Folder> visitor) {
      return new Visiting_Ignored(Calculated_visitor, Objects.requireNonNull(visitor));
    }
  }
  public final class Visiting_Ignored {
    private final Consumer<Calculated> Calculated_visitor;
    private final Consumer<Folder> Folder_visitor;
    private Visiting_Ignored(Consumer<Calculated> Calculated_visitor, Consumer<Folder> Folder_visitor) {
      this.Calculated_visitor = Calculated_visitor;
      this.Folder_visitor = Folder_visitor;
    }
    public FinalVisiting Ignored(Consumer<Ignored> visitor) {
      return new FinalVisiting(Calculated_visitor, Folder_visitor, Objects.requireNonNull(visitor));
    }
  }
  public final class FinalVisiting {
    private final Consumer<Calculated> Calculated_visitor;
    private final Consumer<Folder> Folder_visitor;
    private final Consumer<Ignored> Ignored_visitor;
    private FinalVisiting(Consumer<Calculated> Calculated_visitor, Consumer<Folder> Folder_visitor, Consumer<Ignored> Ignored_visitor) {
      this.Calculated_visitor = Calculated_visitor;
      this.Folder_visitor = Folder_visitor;
      this.Ignored_visitor = Ignored_visitor;
    }
    public void visit() {
      if (Integrity.this instanceof Integrity.Calculated) {
        Calculated_visitor.accept((Integrity.Calculated)Integrity.this);
        return;
      }
      if (Integrity.this instanceof Integrity.Folder) {
        Folder_visitor.accept((Integrity.Folder)Integrity.this);
        return;
      }
      if (Integrity.this instanceof Integrity.Ignored) {
        Ignored_visitor.accept((Integrity.Ignored)Integrity.this);
        return;
      }
      throw new IllegalStateException("Encountered illegal Integrity subclass");
    }
  }

}
