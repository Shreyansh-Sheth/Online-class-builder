import { t } from "../utils/trpc/v10";
import { tProtectedProcedure } from "../utils/trpc/v10ProtectedRouter";
import { ContentJsonValidator } from "@tutor/validation/lib/courseContent";
import { TRPCError } from "@trpc/server";
import { addNotes, notesId, updateNote } from "@tutor/validation/lib/notes";
const noteRouter = t.router({
  addNote: tProtectedProcedure
    .input(addNotes)
    .mutation(async ({ ctx, input }) => {
      // console.log(input.note, input.urlList);
      const course = await ctx.PrismaClient.courses.findUnique({
        where: {
          id: input.courseId,
        },
        include: {
          storeFront: true,
        },
      });
      if (!course || course.storeFront.userId !== ctx.userData.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const courseContentJsonData =
        await ctx.PrismaClient.courseContentJSON.findUnique({
          where: {
            coursesId: input.courseId,
          },
        });
      const courseJsonData =
        courseContentJsonData?.json as typeof ContentJsonValidator["_input"];

      const notesData = await ctx.PrismaClient.notes.create({
        include: { Content: true },
        data: {
          name: input.name,
          coursesId: input.courseId,
          note: input.note,
          Content: {
            create: {
              type: "NOTES",
              coursesId: input.courseId,
            },
          },
        },
      });

      if (!notesData?.Content) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const newData = [
        ...courseJsonData,
        { id: notesData?.Content.id, index: courseJsonData.length },
      ];

      await ctx.PrismaClient.courseContentJSON.update({
        where: {
          coursesId: input.courseId,
        },
        data: {
          json: newData,
        },
      });
      return notesData;
    }),
  updateNotesById: tProtectedProcedure
    .input(updateNote)
    .mutation(async ({ ctx, input }) => {
      return await ctx.PrismaClient.notes.updateMany({
        data: {
          name: input.name,
          note: input.note,
        },
        where: {
          id: input.noteId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });
    }),
  getNotesById: tProtectedProcedure
    .input(notesId)
    .query(async ({ ctx, input }) => {
      return await ctx.PrismaClient.notes.findFirst({
        include: {
          Content: true,
        },
        where: {
          id: input.noteId,
          course: {
            storeFront: {
              userId: ctx.userData.id,
            },
          },
        },
      });
    }),
});
export default noteRouter;
