import java.util.Objects;
import java.util.function.Consumer;
import java.util.function.Function;

public abstract class Integrity {

  private static final Integrity.Folder Folder = new Folder();
  private static final Integrity.Polder Polder = new Polder();

  private Integrity() {}

  public static Integrity.Calculated Calculated(String checksum) {
    return new Calculated(checksum);
  }

  public static Integrity.CalculatedX CalculatedX(String checksum, int flurp) {
    return new CalculatedX(checksum, flurp);
  }

  public static Integrity.Folder Folder() {
    return Folder;
  }

  public static Integrity.Polder Polder() {
    return Polder;
  }

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

  public final static class CalculatedX extends Integrity {
    public final String checksum;
    public final int flurp;
    private CalculatedX(String checksum, int flurp) {
      this.checksum = Objects.requireNonNull(checksum);
      this.flurp = flurp;
    }
    @Override
    public String toString() {
      return "CalculatedX{"
        + "checksum=" + checksum
        + ",flurp=" + flurp
        + "}";
    }
    @Override
    public boolean equals(Object o) {
      if (o == this) {
        return true;
      }
      if (o instanceof Integrity.CalculatedX) {
        Integrity.CalculatedX that = (Integrity.CalculatedX) o;
        return
          this.checksum.equals(that.checksum)
          && this.flurp == that.flurp
          ;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return Objects.hash(733181498, this.checksum, this.flurp);
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

  public final static class Polder extends Integrity {
    private Polder() {
    }
    @Override
    public String toString() {
      return "Polder{"
        + "}";
    }
    @Override
    public boolean equals(Object o) {
      if (o == this) {
        return true;
      }
      if (o instanceof Integrity.Polder) {
        return true;
      }
      return false;
    }
    @Override
    public int hashCode() {
      return Objects.hash(1898807612);
    }
  }

  public final <T> Matching_Calculated<T> matching() {
    return new Matching_Calculated<T>();
  }
  public final class Matching_Calculated<T> {
    private Matching_Calculated() {
    }
    public Matching_CalculatedX<T> Calculated(Function<Calculated, T> matcher) {
      return new Matching_CalculatedX<T>(Objects.requireNonNull(matcher));
    }
  }
  public final class Matching_CalculatedX<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private Matching_CalculatedX(Function<Calculated, T> Calculated_matcher) {
      this.Calculated_matcher = Calculated_matcher;
    }
    public Matching_Folder<T> CalculatedX(Function<CalculatedX, T> matcher) {
      return new Matching_Folder<T>(Calculated_matcher, Objects.requireNonNull(matcher));
    }
  }
  public final class Matching_Folder<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private final Function<CalculatedX, T> CalculatedX_matcher;
    private Matching_Folder(Function<Calculated, T> Calculated_matcher, Function<CalculatedX, T> CalculatedX_matcher) {
      this.Calculated_matcher = Calculated_matcher;
      this.CalculatedX_matcher = CalculatedX_matcher;
    }
    public Matching_Polder<T> Folder(Function<Folder, T> matcher) {
      return new Matching_Polder<T>(Calculated_matcher, CalculatedX_matcher, Objects.requireNonNull(matcher));
    }
  }
  public final class Matching_Polder<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private final Function<CalculatedX, T> CalculatedX_matcher;
    private final Function<Folder, T> Folder_matcher;
    private Matching_Polder(Function<Calculated, T> Calculated_matcher, Function<CalculatedX, T> CalculatedX_matcher, Function<Folder, T> Folder_matcher) {
      this.Calculated_matcher = Calculated_matcher;
      this.CalculatedX_matcher = CalculatedX_matcher;
      this.Folder_matcher = Folder_matcher;
    }
    public FinalMatching<T> Polder(Function<Polder, T> matcher) {
      return new FinalMatching<T>(Calculated_matcher, CalculatedX_matcher, Folder_matcher, Objects.requireNonNull(matcher));
    }
  }
  public final class FinalMatching<T> {
    private final Function<Calculated, T> Calculated_matcher;
    private final Function<CalculatedX, T> CalculatedX_matcher;
    private final Function<Folder, T> Folder_matcher;
    private final Function<Polder, T> Polder_matcher;
    private FinalMatching(Function<Calculated, T> Calculated_matcher, Function<CalculatedX, T> CalculatedX_matcher, Function<Folder, T> Folder_matcher, Function<Polder, T> Polder_matcher) {
      this.Calculated_matcher = Calculated_matcher;
      this.CalculatedX_matcher = CalculatedX_matcher;
      this.Folder_matcher = Folder_matcher;
      this.Polder_matcher = Polder_matcher;
    }
    public T get() {
      if (Integrity.this instanceof Integrity.Calculated) {
        return Calculated_matcher.apply((Integrity.Calculated)Integrity.this);
      }
      if (Integrity.this instanceof Integrity.CalculatedX) {
        return CalculatedX_matcher.apply((Integrity.CalculatedX)Integrity.this);
      }
      if (Integrity.this instanceof Integrity.Folder) {
        return Folder_matcher.apply((Integrity.Folder)Integrity.this);
      }
      if (Integrity.this instanceof Integrity.Polder) {
        return Polder_matcher.apply((Integrity.Polder)Integrity.this);
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
    public Visiting_CalculatedX Calculated(Consumer<Calculated> visitor) {
      return new Visiting_CalculatedX(Objects.requireNonNull(visitor));
    }
  }
  public final class Visiting_CalculatedX {
    private final Consumer<Calculated> Calculated_visitor;
    private Visiting_CalculatedX(Consumer<Calculated> Calculated_visitor) {
      this.Calculated_visitor = Calculated_visitor;
    }
    public Visiting_Folder CalculatedX(Consumer<CalculatedX> visitor) {
      return new Visiting_Folder(Calculated_visitor, Objects.requireNonNull(visitor));
    }
  }
  public final class Visiting_Folder {
    private final Consumer<Calculated> Calculated_visitor;
    private final Consumer<CalculatedX> CalculatedX_visitor;
    private Visiting_Folder(Consumer<Calculated> Calculated_visitor, Consumer<CalculatedX> CalculatedX_visitor) {
      this.Calculated_visitor = Calculated_visitor;
      this.CalculatedX_visitor = CalculatedX_visitor;
    }
    public Visiting_Polder Folder(Consumer<Folder> visitor) {
      return new Visiting_Polder(Calculated_visitor, CalculatedX_visitor, Objects.requireNonNull(visitor));
    }
  }
  public final class Visiting_Polder {
    private final Consumer<Calculated> Calculated_visitor;
    private final Consumer<CalculatedX> CalculatedX_visitor;
    private final Consumer<Folder> Folder_visitor;
    private Visiting_Polder(Consumer<Calculated> Calculated_visitor, Consumer<CalculatedX> CalculatedX_visitor, Consumer<Folder> Folder_visitor) {
      this.Calculated_visitor = Calculated_visitor;
      this.CalculatedX_visitor = CalculatedX_visitor;
      this.Folder_visitor = Folder_visitor;
    }
    public FinalVisiting Polder(Consumer<Polder> visitor) {
      return new FinalVisiting(Calculated_visitor, CalculatedX_visitor, Folder_visitor, Objects.requireNonNull(visitor));
    }
  }
  public final class FinalVisiting {
    private final Consumer<Calculated> Calculated_visitor;
    private final Consumer<CalculatedX> CalculatedX_visitor;
    private final Consumer<Folder> Folder_visitor;
    private final Consumer<Polder> Polder_visitor;
    private FinalVisiting(Consumer<Calculated> Calculated_visitor, Consumer<CalculatedX> CalculatedX_visitor, Consumer<Folder> Folder_visitor, Consumer<Polder> Polder_visitor) {
      this.Calculated_visitor = Calculated_visitor;
      this.CalculatedX_visitor = CalculatedX_visitor;
      this.Folder_visitor = Folder_visitor;
      this.Polder_visitor = Polder_visitor;
    }
    public void visit() {
      if (Integrity.this instanceof Integrity.Calculated) {
        Calculated_visitor.accept((Integrity.Calculated)Integrity.this);
        return;
      }
      if (Integrity.this instanceof Integrity.CalculatedX) {
        CalculatedX_visitor.accept((Integrity.CalculatedX)Integrity.this);
        return;
      }
      if (Integrity.this instanceof Integrity.Folder) {
        Folder_visitor.accept((Integrity.Folder)Integrity.this);
        return;
      }
      if (Integrity.this instanceof Integrity.Polder) {
        Polder_visitor.accept((Integrity.Polder)Integrity.this);
        return;
      }
      throw new IllegalStateException("Encountered illegal Integrity subclass");
    }
  }

}
