from graph import run_debate
import asyncio


# ✅ Better dataset
dataset = [
    {"claim": "The Earth is flat", "label": "FALSE"},
    {"claim": "Water boils at 100°C", "label": "TRUE"},
    {"claim": "Humans need oxygen to survive", "label": "TRUE"},
    {"claim": "The sun revolves around the Earth", "label": "FALSE"},
    {"claim": "Vaccines cause autism", "label": "FALSE"},
]


# ✅ Normalize prediction
def normalize_result(result_str: str):
    if not result_str:
        return "UNKNOWN"

    text = result_str.upper()

    if "FALSE" in text:
        return "FALSE"
    elif "TRUE" in text:
        return "TRUE"
    elif "PARTIALLY" in text:
        return "PARTIALLY TRUE"
    else:
        return "UNVERIFIED"


async def evaluate():
    correct = 0

    for item in dataset:
        result = None

        print("\n🔍 CLAIM:", item["claim"])
        print("EXPECTED:", item["label"])

        # Run debate system
        async for event in run_debate(item["claim"]):
            if event["stage"] == "judge":
                result = event["data"].get("verdict", {})

        if result:
            predicted_raw = result.get("result", "")
            predicted = normalize_result(predicted_raw)

            print("PREDICTED:", predicted)
            print("RAW OUTPUT:", predicted_raw)

            if predicted == item["label"]:
                correct += 1
                print("✅ CORRECT")
            else:
                print("❌ WRONG")

        else:
            print("❌ No result returned")

        print("-" * 50)

    accuracy = correct / len(dataset)
    print("\n🎯 FINAL ACCURACY:", round(accuracy, 2))


# Run evaluation
asyncio.run(evaluate())