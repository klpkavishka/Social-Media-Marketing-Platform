"""
Convert caption model artifact into a runtime-compatible format.

Run this in the SAME Python environment used to train/export final_model.h5.
It writes:
  - caption_model.keras (preferred runtime model)
"""

from pathlib import Path


def main() -> None:
    from tensorflow.keras.models import load_model

    base = Path(__file__).resolve().parent
    source = base / "final_model.h5"
    target = base / "caption_model.keras"

    if not source.exists():
        raise FileNotFoundError(f"Missing source model: {source}")

    print(f"Loading: {source}")
    model = load_model(source, compile=False)

    print(f"Saving:  {target}")
    model.save(target)
    print("Done.")


if __name__ == "__main__":
    main()
