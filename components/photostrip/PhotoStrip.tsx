"use client";

type PhotoStripProps = {
  myPhoto: string;
  partnerPhoto: string;
  username: string;
  partnerName: string;
};


export default function PhotoStrip({
  myPhoto,
  partnerPhoto,
  username,
  partnerName,
}: PhotoStripProps) {


  const downloadImage = async () => {

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    if (!ctx) return;



    const drawCoverImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const imageRatio = image.width / image.height;
  const frameRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imageRatio > frameRatio) {
    // Image is wider than the frame
    sw = image.height * frameRatio;
    sx = (image.width - sw) / 2;
  } else {
    // Image is taller than the frame
    sh = image.width / frameRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    x,
    y,
    width,
    height
  );
};

    const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.lineTo(x + width - radius, y);

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y + height - radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  ctx.lineTo(
    x + radius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  ctx.lineTo(
    x,
    y + radius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();
};

    



    const img1 = new Image();
    const img2 = new Image();


    img1.src = myPhoto;
    img2.src = partnerPhoto;


    await Promise.all([
      new Promise((resolve) => {
        img1.onload = resolve;
      }),

      new Promise((resolve) => {
        img2.onload = resolve;
      }),
    ]);


    const width = 1400;
    const height = 1120;


    canvas.width = width;
    canvas.height = height;


    ctx.fillStyle = "#f8fbff";
    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    ctx.fillStyle = "#0284c7";

    ctx.font = "bold 70px Arial";

    ctx.fillText(
      "💙 TogetherFrame",
      width / 2,
      140
    );

    ctx.fillStyle = "#f8fbff";
    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    ctx.fillStyle = "#0284c7";

    ctx.font = "bold 70px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
      "💙 TogetherFrame",
      width / 2,
      140
    );

    // White cards
    ctx.shadowColor = "rgba(0,0,0,0.15)";
ctx.shadowBlur = 18;
ctx.shadowOffsetY = 8;

ctx.fillStyle = "#ffffff";

drawRoundedRect(ctx, 110, 190, 490, 490, 24);
ctx.fill();

drawRoundedRect(ctx, 800, 190, 490, 490, 24);
ctx.fill();

ctx.shadowBlur = 0;
ctx.shadowOffsetY = 0;

    // Then draw the images on top
    drawCoverImage(
      ctx,
      img1,
      135,
      215,
      440,
      440
    );

    drawCoverImage(
      ctx,
      img2,
      825,
      215,
      440,
      440
    );

    drawCoverImage(
      ctx,
      img1,
      140,
      220,
      450,
      450
    );

    drawCoverImage(
      ctx,
      img2,
      810,
      220,
      450,
      450
    );


    ctx.fillStyle = "#0f172a";

    ctx.font = "bold 42px Arial";


ctx.font = "bold 44px Arial";
ctx.fillStyle = "#2563eb";

ctx.fillText(
  `${username} 💙 ${partnerName}`,
  width / 2,
  790
);


    ctx.font = "36px Arial";


    ctx.fillText(
      "One moment. Two hearts.",
      width / 2,
      860
    );


    ctx.fillText(
      "One beautiful memory 💙",
      width / 2,
      910
    );


    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    ctx.font = "30px Arial";
    ctx.fillStyle = "#60a5fa";

    ctx.fillText(
      today,
      width / 2,
      1010
    );




    const link = document.createElement("a");

    const safeUser = username.replace(/\s+/g, "_");
    const safePartner = partnerName.replace(/\s+/g, "_");

    link.download = `TogetherFrame_${safeUser}_${safePartner}.png`;

    link.href = canvas.toDataURL(
      "image/png"
    );

    link.click();

  };


  return (

    <div className="
      mt-10
      rounded-3xl
      bg-white
      p-6
      shadow-xl
    ">


      <h2 className="
        mb-6
        text-center
        text-2xl
        font-bold
        text-sky-600
      ">
        💙 Your Memory
      </h2>



      <div className="
        rounded-3xl
        bg-sky-100
        p-6
      ">


        <div className="
          grid
          grid-cols-2
          gap-4
        ">

          <img
            src={myPhoto}
            className="rounded-2xl shadow"
            alt="You"
          />


          <img
            src={partnerPhoto}
            className="rounded-2xl shadow"
            alt="Partner"
          />

        </div>



        <p className="
          mt-5
          text-center
          text-xl
          font-bold
          text-sky-700
        ">
          💙 TogetherFrame
        </p>



      </div>



      <button
        onClick={downloadImage}
        className="
          mt-6
          w-full
          rounded-2xl
          bg-sky-500
          py-3
          font-semibold
          text-white
          hover:bg-sky-600
        "
      >
        📥 Download Memory
      </button>


    </div>

  );
}
